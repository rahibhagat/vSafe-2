//Action to get all Repos
export function getRepos(response) {
    return{
      type: 'Get_Repos',
      payload: response
    }
  }
  // Thunk function, it calls the getRepos action above after it receives the fetch response.
  export function getRepoThunk() {
    return function(dispatch, getState) {
      fetch('https://api.github.com/repositories')
      .then(e => e.json())
        .then(function(response){
          var arr = response.slice(0,10);
          dispatch(getRepos(arr))
        })
        .catch((error) => {
        });
    }
  }
  // Repo selected action
  export function repoSelected(repo){
    return{
      type: 'Repo_Selected',
      payload: repo
    }
  }
  export function incrementCounter(){
    return{
      type: 'Counter',
      payload: 5
    }
  }