export function ViewSiteLink() {
  return (
    <a className="fo-navlink-external" href="/" rel="noreferrer" target="_blank">
      View the live site
      <svg aria-hidden="true" fill="none" height="12" viewBox="0 0 12 12" width="12">
        <path
          d="M4.5 1.5H10.5V7.5M10.5 1.5L5 7M8.5 7.5v3h-7v-7h3"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

export default ViewSiteLink
