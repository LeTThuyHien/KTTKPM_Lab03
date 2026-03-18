// Component
interface FileSystemComponent {
    show(indent: string): void;
}

// Leaf
class File implements FileSystemComponent {
    constructor(private name: string) {}

    show(indent: string): void {
        console.log(indent + "- File: " + this.name);
    }
}

// Composite
class Folder implements FileSystemComponent {
    private children: FileSystemComponent[] = [];

    constructor(private name: string) {}

    add(component: FileSystemComponent) {
        this.children.push(component);
    }

    show(indent: string): void {
        console.log(indent + "+ Folder: " + this.name);
        this.children.forEach(c => c.show(indent + "  "));
    }
}

// Test
const root = new Folder("Root");
const file1 = new File("a.txt");
const subFolder = new Folder("Docs");

subFolder.add(new File("b.txt"));
root.add(file1);
root.add(subFolder);

root.show("");