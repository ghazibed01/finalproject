import { DOCUMENT } from '@angular/common';
import {
  Component,
  Inject,
  ElementRef,
  OnInit,
  Renderer2,
} from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ConfigService } from '@config';
import {
  AuthService,
  InConfiguration,
  LanguageService,
  RightSidebarService,
} from '@core';
import { StorageService } from '@core/service/storage.service';
import {RhService } from 'app/admin/rh/services/rh.service';
import { UnsubscribeOnDestroyAdapter } from '@shared';
import { SettingsDialogComponent } from 'app/admin/settings-dialog/settings-dialog.component';
import { AccountDialogComponent } from 'app/admin/account-dialog/account-dialog.component';

interface Notifications {
  message: string;
  time: string;
  icon: string;
  color: string;
  status: string;
}

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent
  extends UnsubscribeOnDestroyAdapter
  implements OnInit
{
  public config!: InConfiguration;
  user: any;
  userImg?: string;
 username?:string ;
  homePage?: string;
  isNavbarCollapsed = true;
  flagvalue: string | string[] | undefined;
  countryName: string | string[] = [];
  langStoreValue?: string;
  defaultFlag?: string;
  isOpenSidebar?: boolean;
  docElement: HTMLElement | undefined;
  isFullScreen = false;
  private roles: string[] = [];
  constructor(
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2,
    public elementRef: ElementRef,
    private rightSidebarService: RightSidebarService,
    private configService: ConfigService,
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog,
    private storageservice : StorageService,
    private service:RhService,
    public languageService: LanguageService
  ) {
    super();
  }

  listLang = [
    { text: 'English', flag: 'assets/images/flags/us.svg', lang: 'en' },
    { text: 'Spanish', flag: 'assets/images/flags/spain.svg', lang: 'es' },
    { text: 'German', flag: 'assets/images/flags/germany.svg', lang: 'de' },
  ];
  notifications: Notifications[] = [
    {
      message: 'Please check your mail',
      time: '14 mins ago',
      icon: 'mail',
      color: 'nfc-green',
      status: 'msg-unread',
    },
    {
      message: 'New Patient Added..',
      time: '22 mins ago',
      icon: 'person_add',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Your leave is approved!! ',
      time: '3 hours ago',
      icon: 'event_available',
      color: 'nfc-orange',
      status: 'msg-read',
    },
    {
      message: 'Lets break for lunch...',
      time: '5 hours ago',
      icon: 'lunch_dining',
      color: 'nfc-blue',
      status: 'msg-read',
    },
    {
      message: 'Patient report generated',
      time: '14 mins ago',
      icon: 'description',
      color: 'nfc-green',
      status: 'msg-read',
    },
    {
      message: 'Please check your mail',
      time: '22 mins ago',
      icon: 'mail',
      color: 'nfc-red',
      status: 'msg-read',
    },
    {
      message: 'Salary credited...',
      time: '3 hours ago',
      icon: 'paid',
      color: 'nfc-purple',
      status: 'msg-read',
    },
  ];
  ngOnInit() {
    this.config = this.configService.configData;
    const storedUser  =this.storageservice.getUser();
      this.roles = storedUser .roles ;
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
   this.username =this.storageservice.Username().username ;
   console.log(this.username) ;
    this.docElement = document.documentElement;

    if (this.roles[0]  === 'Manager') {
      this.homePage = 'admin/dashboard/main';}
    //  else if (this.roles[0]  === '') {
    //   this.homePage = 'employee/dashboard';
    // } else if (this.roles[0]  === '') {
    //   this.homePage = 'dashPM/dashboard';
    // } else {
    //   this.homePage = 'admin/dashboard/main';
    // }

    this.langStoreValue = localStorage.getItem('lang') as string;
    const val = this.listLang.filter((x) => x.lang === this.langStoreValue);
    this.countryName = val.map((element) => element.text);
    if (val.length === 0) {
      if (this.flagvalue === undefined) {
        this.defaultFlag = 'assets/images/flags/us.svg';
      }
    } else {
      this.flagvalue = val.map((element) => element.flag);
    }
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
  openSettingsDialog(): void {
    const dialogRef = this.dialog.open(SettingsDialogComponent, {
      width: '600px',
      // Add any data you want to pass to the dialog here
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle the result here if needed
    });
  }
  openAccountDialog(): void {
    const dialogRef = this.dialog.open(AccountDialogComponent, {
      width: '850px',
      height:'800px',
      // Add any data you want to pass to the dialog here
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      // Handle the result here if needed
    });
  }
  callFullscreen() {
    if (!this.isFullScreen) {
      this.docElement?.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    this.isFullScreen = !this.isFullScreen;
  }
  setLanguage(text: string, lang: string, flag: string) {
    this.countryName = text;
    this.flagvalue = flag;
    this.langStoreValue = lang;
    this.languageService.setLanguage(lang);
  }
  mobileMenuSidebarOpen(event: Event, className: string) {
    const hasClass = (event.target as HTMLInputElement).classList.contains(
      className
    );
    if (hasClass) {
      this.renderer.removeClass(this.document.body, className);
    } else {
      this.renderer.addClass(this.document.body, className);
    }
  }
  callSidemenuCollapse() {
    const hasClass = this.document.body.classList.contains('side-closed');
    if (hasClass) {
      this.renderer.removeClass(this.document.body, 'side-closed');
      this.renderer.removeClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'false');
    } else {
      this.renderer.addClass(this.document.body, 'side-closed');
      this.renderer.addClass(this.document.body, 'submenu-closed');
      localStorage.setItem('collapsed_menu', 'true');
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
