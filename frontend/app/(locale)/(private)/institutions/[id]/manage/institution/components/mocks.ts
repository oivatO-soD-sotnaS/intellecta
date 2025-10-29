import type { InstitutionDetails } from "./types"

export const mockInstitution = (id: string): InstitutionDetails => ({
  institution_id: id,
  user_id: "owner-001",
  name: "Instituto Intellecta",
  email: "contato@intellecta.edu.br",
  description:
    "Instituição dedicada à inovação no ensino, com foco em integração, usabilidade e adoção eficiente.",
  profile_picture: {
    file_id: "logo-001",
    url: "https://picsum.photos/seed/institution-logo/200", 
    filename: "logo.png",
    mime_type: "image/png",
    size: 10240,
  },
  banner: {
    file_id: "banner-001",
    url: "https://picsum.photos/seed/institution-banner/1200/320", 
    filename: "banner.jpg",
    mime_type: "image/jpeg",
    size: 204800,
  },
})
