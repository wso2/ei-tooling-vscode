export interface FileData {
  dataList?: FileNode[]
}

export interface FileNode {
  id: string,
  children?: FileNode[]
  selection: boolean
}

export const root: FileData = {
  dataList: [
    {
      id: "API",
      selection: false,
      children: [
        {
          id: "Resource",
          selection: false,
          children: [{
            selection: true,
            id: "Palette",
            children: [{

              id: "Call",
              selection: true
            },
            {
              id: "Drop",
              selection: true,
            },
            {
              id: "Log",
              selection: true,
            },
            {
              id: "Switch",
              selection: true,
              children: [{
                id: "Case 1",
                selection: true,
              },
              {
                id: "Case 2",
                selection: true
              },
              {
                id: "Case 3",
                selection: true
              },
              {
                id: "Default",
                selection: true
              }]
            }]
          }
          ]
        }
      ]
    },
    {
      id: "Properties",
      selection: false,
      children: [{
        id: "Name: ",
        selection: true,
      },
      {
        id: "Context: ",
        selection: true,
      }]
    }
  ]
}
