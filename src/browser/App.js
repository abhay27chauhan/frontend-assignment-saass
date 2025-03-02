// App.jsx
import React, { useState, useEffect } from "react";
import useFetch from "../shared/Hooks/useFetch";
import processResponse from "../shared/utils/processResponse";

const url =
  "https://raw.githubusercontent.com/saaslabsco/frontend-assignment/refs/heads/master/frontend-assignment.json";

function App() {
  const [response, loading, error] = useFetch(url, processResponse);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const projectsPerPage = 5;

  useEffect(() => {
    if (response.length > 0) {
      setTotalPages(Math.ceil(response.length / projectsPerPage));
    }
  }, [response]);

  // Get current projects
  const indexOfLastProject = currentPage * projectsPerPage;
  const indexOfFirstProject = indexOfLastProject - projectsPerPage;
  const currentProjects = response.slice(
    indexOfFirstProject,
    indexOfLastProject
  );

  // Change page
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  // Generate pagination buttons
  const renderPaginationButtons = () => {
    const pageButtons = [];
    const maxVisibleButtons = 5;

    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxVisibleButtons / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageButtons.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={currentPage === i ? "active" : ""}
          aria-current={currentPage === i ? "page" : null}
        >
          {i}
        </button>
      );
    }

    return pageButtons;
  };

  return (
    <div className="container">
      <header className="header">
        <h1>Funding Information</h1>
      </header>

      <main className="table-container">
        {loading ? (
          <div className="loading" role="status">
            <div className="spinner" aria-hidden="true"></div>
            <div>Loading projects...</div>
          </div>
        ) : error ? (
          <div className="error" role="alert">
            <p>Error: {error}</p>
          </div>
        ) : (
          <>
            <table>
              <thead>
                <tr>
                  <th scope="col">S.No.</th>
                  <th scope="col">Percentage funded</th>
                  <th scope="col">Amount pledged</th>
                </tr>
              </thead>
              <tbody>
                {currentProjects.map((project, index) => (
                  <tr key={indexOfFirstProject + index}>
                    <td>{indexOfFirstProject + index}</td>
                    <td aria-labelledby="percentage-header">{project.percentageFunded}</td>
                    <td aria-labelledby="amount-header">{project.amountPledged}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {response.length === 0 && (
              <div className="no-data" role="status">No projects found</div>
            )}
          </>
        )}
      </main>

      {!loading && !error && response.length > 0 && (
        <div className="pagination" role="navigation" aria-label="Pagination">
          <button
            onClick={goToPreviousPage}
            disabled={currentPage === 1}
            aria-label="Go to previous page"
          >
            Previous
          </button>

          {renderPaginationButtons()}

          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            aria-label="Go to next page"
          >
            Next
          </button>

          <div className="page-info" aria-live="polite">
            Page {currentPage} of {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
