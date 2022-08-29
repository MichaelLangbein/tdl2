export interface Node {
    id: number,
    data: string,
    children: Node[];
}


export const data: Node = {
    id: 1,
    data: 'root',
    children: [{
        id: 2,
        data: 'child1',
        children: [{
            id: 4,
            data: 'grandChild11',
            children: []
        }, {
            id: 5,
            data: 'grandChild12',
            children: []
        }]
    }, {
        id: 3,
        data: 'child2',
        children: [{
            id: 6,
            data: 'grandChild21',
            children: []
        }]
    }]
};