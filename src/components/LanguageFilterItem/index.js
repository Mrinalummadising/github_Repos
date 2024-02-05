import './index.css'

const LanguageFilterItem = props => {
  const {eachLanguage, isActive, changeActiveBtn} = props
  const {id, language} = eachLanguage
  const buttonHeight = isActive ? 'high-light' : ''

  const onClickingLanguageBtn = () => {
    changeActiveBtn(id)
  }

  return (
    <li>
      <button
        type="button"
        className={`each-language ${buttonHeight}`}
        onClick={onClickingLanguageBtn}
      >
        {language}
      </button>
    </li>
  )
}

export default LanguageFilterItem
