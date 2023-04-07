import * as ShapeComponents from '../components/index';

export function getComponent(type: string, args: any) {
    console.log(ShapeComponents);
    const ShapeComponent = (ShapeComponents as any)[type];

    if (ShapeComponent) {
        return <ShapeComponent {...args} />
    }

    return <></>;
}
