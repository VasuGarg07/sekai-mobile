export interface SekaiUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
  /** Firebase provider IDs: "google.com", "github.com", "password". */
  providers: string[];
}
