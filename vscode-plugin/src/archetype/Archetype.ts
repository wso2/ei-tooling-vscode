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
