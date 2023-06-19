import sampleData from './SamplesData.json';

export class SampleUtils {
    private dataMap = new Map<string, any[]>();
    private types: string[] = [];
    private cardData: any[] = [];

    constructor(path: string){
        this.types.push('All');
        sampleData.forEach((item: any) => {
            const tempType = item.name;
            this.types.push(tempType);
            var tempData:any;
            this.dataMap.set(tempType, []);
            if (item.wizards) {
                item.wizards.forEach((wizard: any) => {
                    tempData = {
                        title: wizard.title,
                        description: wizard.description,
                        icon: wizard.title === 'Hello World Service' ? path + '/icons/categories/Hello_World.png' : path + '/icons/categories/' + item.name + '.png',
                        priority: wizard.priority
                    }
                    this.cardData.push(tempData);
                    this.dataMap.get(tempType)?.push(tempData);
                });
            }
        });
        this.cardData.sort((a: any, b: any) => (a.priority - b.priority));
        this.types = this.types.map((item: string) => item.replace('_', ' '));
    }

    public getAllSamples(): any[] {
        return this.cardData;
    }

    public getFilteredSampleList(category:string): any[] {
        if (category === 'All') {
            return this.cardData;
        } else {
            return this.dataMap.get(category)??[];
        }
    }

    public getFilteredSampleListBySearch(searchCardData:any[], searchText:string): any[] {
        if (searchText === '') {
            return searchCardData;
        } else {
            return searchCardData.filter((item: any) => item.title.toLowerCase().includes(searchText.toLowerCase()));
        }
    }

    public getTypes(): string[] {
        return this.types;
    }
}