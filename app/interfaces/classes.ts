class KanbanEntry {
  id: number;

  title: string;

  subtitle: string;

  description: string;

  label: string;

  duedate: string;

  belongsto: string;

  constructor(
    i: number,
    t: string,
    s: string,
    de: string,
    l: string,
    dd: string,
    b: string
  ) {
    this.id = i;
    this.title = t;
    this.subtitle = s;
    this.description = de;
    this.label = l;
    this.duedate = dd;
    this.belongsto = b;
  }

  getId() {
    return this.id;
  }
}

export default { KanbanEntry };
