export type Entry = {
    start?: string,
    end?: string,
    title?: string
    outcome?: string
    onChange?: (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
        field: "title" | "outcome"
    ) => void
  }