import { createClient } from "next-sanity";

export const client = createClient({
  projectId: "ux4tvebq",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
});