export default // NUMBER OF RESULTS FROM SEARCH QUERY
function NumResults({ movies }) {
  return (
    <p className='num-results'>
      Found <strong>{movies.length}</strong> results
    </p>
  )
}
