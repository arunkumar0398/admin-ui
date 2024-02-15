import { CaretLeftOutlined, CaretRightOutlined, BackwardOutlined, ForwardOutlined } from "@ant-design/icons";

 // Pagination component for rendering pagination controls
export const Pagination = ({ currentPage, totalPages, onPageChange, onFirstPageClick, onLastPageClick, onDeleteSelected }) => {
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    return (
        <div className="pagination-bar">
            <div className="delete-section">
                <button className="select-deleted" onClick={onDeleteSelected}>
                    Delete Selected
                </button>
            </div>
            <BackwardOutlined
                className={currentPage === 1 ? "first-page-button" : "first-page-button active"}
                disabled={currentPage === 1}
                onClick={onFirstPageClick}
            />
            <CaretLeftOutlined
                className={currentPage === 1 ? "previous-btn" : "previous-btn active"}
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
            />
            {pageNumbers.map((pageNumber) => (
                <button
                    key={pageNumber}
                    onClick={() => onPageChange(pageNumber)}
                    className={pageNumber === currentPage ? "active page-button" : "page-button"}
                >
                    {pageNumber}
                </button>
            ))}
            <CaretRightOutlined
                className={currentPage === totalPages ? "next-btn" : "next-btn active"}
                disabled={currentPage === totalPages}
                onClick={() => onPageChange(currentPage + 1)}
            />
            <ForwardOutlined
                className={currentPage === totalPages ? "last-page-button" : "last-page-button active"}
                disabled={currentPage === totalPages}
                onClick={onLastPageClick}
            />
        </div>
    );
};
