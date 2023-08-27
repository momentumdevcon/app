import { Allow, Entity, Fields, Validators, remult } from "remult";

@Entity<Bookmark>("bookmarks", {
  allowApiCrud: Allow.authenticated,
  allowApiInsert: (b, r) => b?.userId === r?.user?.id,
  allowApiDelete: (b, r) => b?.userId === r?.user?.id,
  apiPrefilter: () => (remult.user?.id ? { userId: remult.user?.id } : {}),
})
export class Bookmark {
  @Fields.uuid()
  id = "";

  @Fields.string({
    validate: Validators.required,
  })
  userId = "";

  @Fields.string({
    validate: Validators.required,
  })
  sessionId = "";
}
