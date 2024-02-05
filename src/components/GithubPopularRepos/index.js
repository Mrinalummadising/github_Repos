import {Component} from 'react'
import Loader from 'react-loader-spinner'
import LanguageFilterItem from '../LanguageFilterItem'
import RepositoryItem from '../RepositoryItem'
import './index.css'

const languageFiltersData = [
  {id: 'ALL', language: 'All'},
  {id: 'JAVASCRIPT', language: 'Javascript'},
  {id: 'RUBY', language: 'Ruby'},
  {id: 'JAVA', language: 'Java'},
  {id: 'CSS', language: 'CSS'},
]

const apiStatusConstants = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'INPROGRESS',
}

class GithubPopularRepos extends Component {
  state = {
    currentLanguage: languageFiltersData[0].id,
    apiStatus: apiStatusConstants.initial,
    repositories: [],
  }

  componentDidMount() {
    this.getRepositories()
  }

  getRepositories = async () => {
    const {currentLanguage} = this.state
    this.setState({apiStatus: apiStatusConstants.inProgress})
    const url = `https://apis.ccbp.in/popular-repos?language=${currentLanguage}`

    const repositoriesResponse = await fetch(url)
    if (repositoriesResponse.ok) {
      const jsonResponse = await repositoriesResponse.json()
      const updatedRepositories = jsonResponse.popular_repos.map(
        eachRepository => ({
          id: eachRepository.id,
          name: eachRepository.name,
          avatarUrl: eachRepository.avatar_url,
          forksCount: eachRepository.forks_count,
          issuesCount: eachRepository.issues_count,
          starsCount: eachRepository.stars_count,
        }),
      )
      this.setState({
        apiStatus: apiStatusConstants.success,
        repositories: updatedRepositories,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  changeActiveBtn = id => {
    this.setState({currentLanguage: id}, this.getRepositories)
  }

  renderLanguageFilterItems = () => {
    const {currentLanguage} = this.state

    return (
      <ul className="languages-container">
        {languageFiltersData.map(eachLanguage => (
          <LanguageFilterItem
            eachLanguage={eachLanguage}
            key={eachLanguage.id}
            isActive={currentLanguage === eachLanguage.id}
            changeActiveBtn={this.changeActiveBtn}
          />
        ))}
      </ul>
    )
  }

  renderLoadingView = () => (
    <div data-testid="loader">
      <Loader type="ThreeDots" color="#0284c7" height={80} width={80} />
    </div>
  )

  renderRepositoriesList = () => {
    const {repositories} = this.state
    return (
      <ul className="all-repositories-container">
        {repositories.map(eachRepository => (
          <RepositoryItem
            eachRepository={eachRepository}
            key={eachRepository.id}
          />
        ))}
      </ul>
    )
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/api-failure-view.png"
        className="failure-img"
        alt="failure view"
      />
      <h1 className="failure-txt">Something went wrong</h1>
    </div>
  )

  renderRepositoryItems = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderRepositoriesList()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      case apiStatusConstants.inProgress:
        return this.renderLoadingView()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="github-main-container">
        <h1 className="github-main-heading">Popular</h1>
        {this.renderLanguageFilterItems()}
        {this.renderRepositoryItems()}
      </div>
    )
  }
}

export default GithubPopularRepos
