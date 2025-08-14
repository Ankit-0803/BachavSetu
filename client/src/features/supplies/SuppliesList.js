import React from 'react';

const SuppliesList = ({ supplies }) => {
  return (
    <div className="supplies-list">
      {supplies.length === 0 ? (
        <p>No supplies available</p>
      ) : (
        <div className="supplies-grid">
          {supplies.map((supply) => (
            <div key={supply._id || supply.batch} className="supply-card">
              <h4>{supply.productName}</h4>
              <div className="supply-details">
                <span className="quantity">{supply.quantity} {supply.unit}</span>
                {supply.batch && (
                  <span className="batch">Batch: {supply.batch}</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuppliesList;
