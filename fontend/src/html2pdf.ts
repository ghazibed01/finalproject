declare module 'html2pdf.js' {
    const html2pdf: {
      (): {
        from: (element: HTMLElement) => {
          set: (options: any) => {
            toPdf: () => Promise<any>;
            save(): void;
            output(type: 'blob'): Promise<Blob>;
          };
        };
      };
    };
    export = html2pdf;
  }