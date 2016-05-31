import * as React from 'react'
import ReposList from './repos-list'
import Info from './info'
import UsersStore from './users-store'
import User from './user'
import NotLoggedIn from './not-logged-in'
import API from './lib/api'
import {Repo} from './lib/api'

interface AppState {
  selectedRow: number,
  repos: Repo[],
  loadingRepos: boolean,
  user: User
}

interface AppProps {
  usersStore: UsersStore,
  style?: Object
}

const AppStyle = {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1
}

export default class App extends React.Component<AppProps, AppState> {
  private api: API

  public constructor(props: AppProps) {
    super(props)

    props.usersStore.onUsersChanged(users => {
      this.setState(Object.assign({}, this.state, {user: users[0]}))
    })

    const user = props.usersStore.getUsers()[0]
    this.state = {
      selectedRow: -1,
      user,
      loadingRepos: true,
      repos: []
    }

    this.api = new API(user)
  }

  public async componentWillMount() {
    const repos = await this.api.fetchRepos()
    this.setState(Object.assign({}, this.state, {
      loadingRepos: false,
      repos
    }))
  }

  public render() {
    if (!this.state.user) {
      return <NotLoggedIn/>
    }

    const selectedRepo = this.state.repos[this.state.selectedRow]
    const completeStyle = Object.assign({}, this.props.style, AppStyle)
    return (
      <div style={completeStyle}>
        <ReposList selectedRow={this.state.selectedRow}
                   onSelectionChanged={row => this.handleSelectionChanged(row)}
                   user={this.state.user}
                   repos={this.state.repos}
                   loading={this.state.loadingRepos}/>
        <Info selectedRepo={selectedRepo} user={this.state.user}/>
      </div>
    )
  }

  private handleSelectionChanged(row: number) {
    this.setState(Object.assign({}, this.state, {selectedRow: row}))
  }
}
