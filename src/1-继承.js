// 继承
class People {
  constructor(name, age ) {
    this.name = name ;
    this.age = age;
  }
}


class Student extends People {
  constructor(name, age, number) {
    super(name, age)
    this.number = number
  }

  study() {
    console.log(`${this.name} study`)
  }
}

let xiaoming = new Student('xiaoming',23,1)
xiaoming.study()
