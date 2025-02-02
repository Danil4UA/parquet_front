export type Modes = Record<string, boolean | string | undefined>


export function classNames(cls: string, modes: Modes = {}, additional: Array<string | undefined> = []): string {
    return [
        cls,
        ...additional.filter(Boolean),
        ...Object.entries(modes)
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .filter(([_, value])=> Boolean(value))
            .map(([className])=> className)
    ]
        .join(" ") 
} 