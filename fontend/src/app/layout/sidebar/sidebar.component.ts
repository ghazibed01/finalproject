/* eslint-disable @typescript-eslint/no-unused-vars */
import { Router, NavigationEnd } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
  HostListener,
  OnDestroy,
} from '@angular/core';
import { ROUTES } from './sidebar-items';
import { RouteInfo } from './sidebar.metadata';
import { AuthService, Role } from '@core';
import { StorageService } from '@core/service/storage.service';
import { RhService } from 'app/admin/rh/services/rh.service';
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent implements OnInit, OnDestroy {
  public sidebarItems!: RouteInfo[];
  public innerHeight?: number;
  public bodyTag!: HTMLElement;
  listMaxHeight?: string;
  listMaxWidth?: string;
  userFullName?: string;
  user:any;
  userImg?: string;
  userType?: string;
  headerHeight = 60;
  currentRoute?: string;
  routerObj;
  private roles: string[] = [];

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private authService: AuthService,
    private storageservice : StorageService,
    private service:RhService,
    private router: Router
  ) {
    this.elementRef.nativeElement.closest('body');
    this.routerObj = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        // close sidebar on mobile screen after menu select
        this.renderer.removeClass(this.document.body, 'overlay-open');
      }
    });
  }
  @HostListener('window:resize', ['$event'])
  windowResizecall() {
    this.setMenuHeight();
    this.checkStatuForResize(false);
  }
  @HostListener('document:mousedown', ['$event'])
  onGlobalClick(event: Event): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.renderer.removeClass(this.document.body, 'overlay-open');
    }
  }

  callToggleMenu(event: Event, length: number) {
    if (length > 0) {
      const parentElement = (event.target as HTMLInputElement).closest('li');
      const activeClass = parentElement?.classList.contains('active');

      if (activeClass) {
        this.renderer.removeClass(parentElement, 'active');
      } else {
        this.renderer.addClass(parentElement, 'active');
      }
    }
  }
  ngOnInit() {
    if (this.authService.currentUserValue) {
      const storedUser =this.storageservice.getUser();
      this.roles = storedUser.roles ;
      //const userRole = this.authService.currentUserValue.role;
      this.userFullName =
        this.authService.currentUserValue.username
  
        console.log("user:" , storedUser );
        if (storedUser  && storedUser .id) {
          this.service.getUserById(storedUser .id).subscribe(
            completeUserData => {
              this.user = completeUserData;
              console.log("userALL:" , this.user );
              if (this.user && this.user.imageData) {
                this.userImg = this.convertImageData(this.user.imageData);
              }
            },
            error => {
              console.error('Error fetching complete user data:', error);
            }
          );
        } else {
          console.error('No stored user found.');
        }

      this.sidebarItems = ROUTES.filter(
        (x) => x.role.indexOf(this.roles[0] ) !== -1 
      );
      if (this.roles[0]  === Role.Manager) {
        this.userType = Role.Manager;
      } else if (this.roles[0]  === Role.Employe) {
        this.userType = Role.Employe;
      } else if (this.roles[0] === Role.Rh) {
        this.userType = Role.Rh;
      } else {
        this.userType = Role.Manager;
      }
    }

    // this.sidebarItems = ROUTES.filter((sidebarItem) => sidebarItem);
    this.initLeftSidebar();
    this.bodyTag = this.document.body;
  }
  private convertImageData(base64Data: string): string {
    // Ensure the base64 data does not have any extraneous characters
    base64Data = base64Data.trim();
    
    // Check if the base64 data starts with "data:image/png;base64,"
    if (!base64Data.startsWith('data:image/png;base64,')) {
      // Add the prefix if not present
      return `data:image/png;base64,${base64Data}`;
    }
    
    return base64Data;
  }
  ngOnDestroy() {
    this.routerObj.unsubscribe();
  }
  initLeftSidebar() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    // Set menu height
    _this.setMenuHeight();
    _this.checkStatuForResize(true);
  }
  setMenuHeight() {
    this.innerHeight = window.innerHeight;
    const height = this.innerHeight - this.headerHeight;
    this.listMaxHeight = height + '';
    this.listMaxWidth = '500px';
  }
  isOpen() {
    return this.bodyTag.classList.contains('overlay-open');
  }

  checkStatuForResize(firstTime: boolean) {
    if (window.innerWidth < 1170) {
      this.renderer.addClass(this.document.body, 'ls-closed');
    } else {
      this.renderer.removeClass(this.document.body, 'ls-closed');
    }
  }
  mouseHover() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('submenu-closed')) {
      this.renderer.addClass(this.document.body, 'side-closed-hover');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
    }
  }
  mouseOut() {
    const body = this.elementRef.nativeElement.closest('body');
    if (body.classList.contains('side-closed-hover')) {
      this.renderer.removeClass(this.document.body, 'side-closed-hover');
      this.renderer.addClass(this.document.body, 'submenu-closed');
    }
  }
logout(): void {
  this.authService.logout().subscribe(() => {
    localStorage.clear(); // ⚠️ pas juste removeItem
    this.router.navigateByUrl('/authentication/signin').then(() => {
      window.location.reload(); // force une nouvelle instance Angular
    });
  });
}
}
