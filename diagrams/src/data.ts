export interface FileNode {
  id: string
  children?: FileNode[]
}

export const root: FileNode = {
  id: "API",
  children: [{
    id: "Resource",
    children: [{
        id: "Palette",
        children: [{
          id: "Call"
        },
        {
          id: "Drop"
        },
        {
          id: "Log"
        },
        {
          id: "Switch",
          children: [{
            id: "Case 1"
          },
          {
            id: "Case 2"
          },
          {
            id: "Case 3"
          },
          {
            id: "Default"
          }]
        }]
      }]
  },
  {
    id: "Properties",
    children: [{
      id: "Name: ",
    },
    {
      id: "Context: "
    }]
  }]
}
