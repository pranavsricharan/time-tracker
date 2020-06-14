export type Entry = {
    start: string,
    end: string,
    title?: string
    outcome?: string
    onChange?: (event: React.ChangeEvent, field: string) => void
  }