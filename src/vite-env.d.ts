
/// <reference types="vite/client" />

declare module 'jspdf' {
  interface jsPDF {
    autoTable: (options: any) => void;
  }
}
