
import './Model.css';

const Modal = ({ article, onClose }) => {
  if (!article) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>×</button>
        <h1 className="modal-title">{article.title}</h1>
        <p className="modal-authors">Authors: {article.authors}</p>
        <p className="modal-publication-date">Published At: {article.publicationDate}</p>
        <p className="modal-publisher">Publisher: {article.publisher}</p>
        <p className="modal-description">{article.description}</p>
        <a href={article.link} target="_blank" rel="noopener noreferrer" className="modal-link">View Article</a>
      </div>
    </div>
  );
};

export default Modal;
