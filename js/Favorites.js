import { GithubUser } from "./GithubUser.js"

export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  async add(username) {
    try {
      const user = await GithubUser.search(username)
      
      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado.')
      }


      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }


  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@github-favorites:')) || []
  }

  save() {
    localStorage.setItem('@github-favorites:', JSON.stringify(this.entries))
  }

  delete(user) {
    const filteredEntries = this.entries.filter(entry => entry.login !== user.login)
    
      this.entries = filteredEntries
      this.update()
      this.save()
  }

  hide(){
    console.log(this.entries)
    if(this.entries.length == 0) {
      console.log(this.root.querySelector("#no-favorites").classList, 'vazio')
      this.root.querySelector("#no-favorites").classList.remove('hide')
    } else {
      this.root.querySelector("#no-favorites").classList.add('hide')
      console.log(this.root.querySelector("#no-favorites").classList, 'cheio')
    }
  }


}

export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }

  onAdd() {
    const favButton = this.root.querySelector('.input-wrapper button')
    favButton.onclick = () => {
      const { value } = this.root.querySelector('.input-wrapper input')

      this.add(value)
    }
  }

  update() {
    this.hide()
    this.removeAllTr()
    
    this.entries.forEach((user) => {
      const row = this.createRow()

      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem do usuário ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user span').textContent = user.name
      row.querySelector('.user p').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm("Deseja deletar essa linha?")
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
  }

  createRow () {
    const tr = document.createElement('tr')

    const data = `
    <td class="user">
      <img src="https://github.com/maykbrito.png" alt="Imagem do usuário Mayk Brito">
      <a href="https://github.com/maykbrito" target="_blank">
        <span>Mayk Brito</span>
        <p>/maykbrito</p>
      </a>
    </td>
    <td class="repositories">123</td>
    <td class="followers">1234</td>
    <td class="remove">
      <button>Remover</button>
    </td>
    `
    tr.innerHTML = data

    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr').forEach((tr) => {
      tr.remove()
    })

  }
}