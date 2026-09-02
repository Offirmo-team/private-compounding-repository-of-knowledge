import type { UUID, WithUUID } from "./types.ts"

interface Test extends WithUUID {
	another: UUID
}
