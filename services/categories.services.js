class CategoriesServices {
  constructor() {
    this.categories = [],
      this.generate();
  }

  generate() {
    this.categories.push({
      name: 'shoes',
      id: '0'
    },
      {
        name: 'clothes',
        id: '1'
      },
      {
        name: 'tech',
        id: '2'
      })
  }

  async find() {
    return this.categories;
  }

  async create(data) {
    const newCategorie = {
      ...data
    };
    this.categories.push(newCategorie);
    return newCategorie;
  }
  async findCategorie(id) {
    return this.categories.find(item => item.id === id);
  }
  async delete(id) {
    const index = this.categories.findIndex(item => item.id === id);
    if (index === -1) {
      throw new Error("Product Not Found");
    }else {
      this.categories.splice(index , 1);
      return {
        message: `Categorie ${id} deleted`
      }
    }
  }
}

module.exports = CategoriesServices;
