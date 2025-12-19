/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_CALENDLY_TOKEN?: string;
  readonly VITE_CALENDLY_USER_URI?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

