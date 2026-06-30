import {
  heroSchema,
  aboutSchema,
  servicesSchema,
  projectSchema,
  settingsSchema,
  btsSchema,
} from "./documents";
import { seoObject, socialLinkObject, ctaButtonObject } from "./objects";

export const schemaTypes = [
  // Objects (referenced by documents)
  seoObject,
  socialLinkObject,
  ctaButtonObject,
  // Documents
  heroSchema,
  aboutSchema,
  servicesSchema,
  projectSchema,
  settingsSchema,
  btsSchema,
];
