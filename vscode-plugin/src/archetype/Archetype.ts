// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT license.

// export interface ArchetypeConstructorArgs {
//     artifactId: string;
//     groupId: string;
//     repository?: string;
//     description?: string;
//     versions?: string[];
// }


// export class Archetype {

//     public get identifier(): string {
//         return `${this.args.groupId}:${this.args.artifactId}`;
//     }
//     constructor(public args:ArchetypeConstructorArgs){}
// }

export class Archetype {
    public artifactId: string | null;
    public groupId: string | null;
    public repository: string | undefined;
    public description: string | undefined;
    public versions: string[];

    public get identifier(): string {
        return `${this.groupId}:${this.artifactId}`;
    }

    constructor(aid: string | null, gid: string | null, repo?: string, desc?: string, versions: string[] = []) {
        this.artifactId = aid;
        this.groupId = gid;
        this.versions = versions;
        this.description = desc;
        this.repository = repo;
    }
}
