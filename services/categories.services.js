class CategoriesServices {
  constructor() {
    this.categories = [],
      this.generate();
  }
  generate() {
    this.categories.push({
      name: 'shoes',
      id: 0
    },
      {
        name: 'clothes',
        id: 1
      },
      {
        name: 'tech',
        id: 2
      })
  }
  async find(){
    return this.categories;
  }
}

module.exports = CategoriesServices;
