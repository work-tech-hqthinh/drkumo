type Obj = {
    id: string;
    name: string;
    age: number;
    bool: boolean;
    code: string;
}

type Example2 = "id"  | "name" | never;

type KEYOF = keyof Obj;

type Example<TData> = {
    [K in keyof TData]: TData[K] extends string ? K : never;
}[keyof TData]

type Alo = Example<Obj>