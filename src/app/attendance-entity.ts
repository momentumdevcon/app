import { Allow, Entity, Fields, Repository, Validators, remult } from "remult";

type AttendanceEvent =
  | {
      type: "added-to-bookmarks";
    }
  | {
      type: "removed-from-bookmarks";
    }
  | {
      type: "marked-as-attended";
    }
  | {
      type: "marked-as-not-attended";
    }
  | {
      type: "rated";
      reaction: 0 | 1 | 2;
    }
  | {
      type: "reviewed";
      review: string;
    };

@Entity<AttendanceRecord>("attendance", {
  allowApiCrud: true,
  // allowApiRead: Allow.authenticated,
  // allowApiInsert: (b, r) => b?.userId === r?.user?.id,
  // apiPrefilter: () =>
  //   remult.isAllowed(`admin`)
  //     ? {}
  //     : remult.user?.id
  //     ? { userId: remult.user?.id }
  //     : {},
})
export class AttendanceRecord {
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

  @Fields.number()
  version = 0;

  @Fields.json<AttendanceRecord>()
  event: AttendanceEvent = { type: "added-to-bookmarks" };

  @Fields.createdAt()
  createdAt = new Date();

  static async push(
    {
      userId,
      sessionId,
      event,
    }: {
      userId: string;
      sessionId: string;
      event: AttendanceEvent;
    },
    repo: Repository<AttendanceRecord>,
  ) {
    const records = await repo.find({ where: { userId, sessionId } });
    const newRecord = await repo.insert({
      userId,
      sessionId,
      event,
      version: records.length,
    });

    return newRecord;
  }

  static async fetch(
    {
      userId,
      sessionId,
    }: {
      userId?: string;
      sessionId: string;
    },
    repo: Repository<AttendanceRecord>,
  ) {
    const records = await repo.find({
      where: { userId, sessionId },
      orderBy: { version: "asc" },
    });
    return records;
  }
}
