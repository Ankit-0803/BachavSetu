// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import {
//   fetchSupplies,
//   createSupply,
//   updateSupply,
//   deleteSupply,
//   changeSupplyQuantity
// } from '../features/supplies/suppliesSlice';
// import SupplyForm from './SupplyForm';
// import './SupplyManagement.css';

// const CATEGORY_IMAGES = {
//   FOOD: '/uploads/food_bachavSetu.jpg',
//   SHELTER: '/uploads/shelter_bachavSetu.jpg',
//   CLOTHES: '/uploads/clothes_bachavSetu.jpg',
// };

// const SupplyManagement = () => {
//   const dispatch = useDispatch();
//   const supplies = useSelector(state => state.supplies.items);
//   const { user } = useSelector(state => state.auth); // Get user info for admin check
//   const [showForm, setShowForm] = useState(false);
//   const [editing, setEditing] = useState(null);

//   useEffect(() => {
//     dispatch(fetchSupplies());
//   }, [dispatch]);

//   const handleAdd = () => {
//     if (!user?.isAdmin) {
//       alert('Only administrators can add supplies.');
//       return;
//     }
//     setEditing(null);
//     setShowForm(true);
//   };

//   const handleEdit = supply => {
//     if (!user?.isAdmin) {
//       alert('Only administrators can edit supplies.');
//       return;
//     }
//     setEditing(supply);
//     setShowForm(true);
//   };

//   const handleDelete = id => {
//     if (!user?.isAdmin) {
//       alert('Only administrators can delete supplies.');
//       return;
//     }
//     if (window.confirm('Delete this supply item?')) {
//       dispatch(deleteSupply(id));
//     }
//   };

//   const handleQuantity = (id, action) => {
//     if (!user?.isAdmin) {
//       alert('Only administrators can modify quantities.');
//       return;
//     }
//     const amount = parseInt(prompt('Enter amount:'), 10);
//     if (amount > 0) {
//       dispatch(changeSupplyQuantity({ id, action, amount }));
//     }
//   };

//   return (
//     <div className="supply-management">
//       {/* Only show add button for admin */}
//       {user?.isAdmin && (
//         <button className="add-btn" onClick={handleAdd}>
//           Add New Supply
//         </button>
//       )}

//       <div className="supplies-overview">
//         {user?.isAdmin ? (
//           <p className="admin-note">💡 As an admin, you can add, edit, and manage all supplies.</p>
//         ) : (
//           <p className="user-note">📋 You can view available supplies. Contact admin to request modifications.</p>
//         )}
//       </div>

//       {['FOOD', 'SHELTER', 'CLOTHES'].map(cat => (
//         <section key={cat} className="category-section">
//           <h3 className="category-title">{cat}</h3>
//           <div className="supply-list">
//             {supplies
//               .filter(s => s.category === cat)
//               .map(s => (
//                 <div className="supply-card" key={s._id}>
//                   <img 
//                     src={CATEGORY_IMAGES[cat]} 
//                     alt={cat} 
//                     className="supply-image"
//                     onError={(e) => {
//                       e.target.src = '/default-supply.png';
//                     }}
//                   />
//                   <div className="supply-info">
//                     <h4 className="supply-name">{s.name}</h4>
//                     <div className="supply-metrics">
//                       <p><strong>Quantity:</strong> {s.quantity}</p>
//                       <p><strong>Location:</strong> {s.location}</p>
//                       <p><strong>Threshold:</strong> {s.threshold}</p>
//                       {s.description && (
//                         <p><strong>Description:</strong> {s.description}</p>
//                       )}
//                     </div>
//                     {s.quantity < s.threshold && (
//                       <div className="alert-badge">
//                         ⚠️ Low Stock Alert!
//                       </div>
//                     )}
//                   </div>
                  
//                   {/* Only show action buttons for admin */}
//                   {user?.isAdmin && (
//                     <div className="supply-actions">
//                       <button className="edit-btn" onClick={() => handleEdit(s)}>
//                         ✏️ Edit
//                       </button>
//                       <button className="delete-btn" onClick={() => handleDelete(s._id)}>
//                         🗑️ Delete
//                       </button>
//                       <div className="quantity-controls">
//                         <button 
//                           className="quantity-btn increase" 
//                           onClick={() => handleQuantity(s._id, 'increase')}
//                           title="Increase quantity"
//                         >
//                           ＋
//                         </button>
//                         <button 
//                           className="quantity-btn decrease" 
//                           onClick={() => handleQuantity(s._id, 'decrease')}
//                           title="Decrease quantity"
//                         >
//                           －
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
            
//             {supplies.filter(s => s.category === cat).length === 0 && (
//               <div className="no-supplies">
//                 📦 No {cat.toLowerCase()} supplies available
//               </div>
//             )}
//           </div>
//         </section>
//       ))}

//       {/* Only show form for admin */}
//       {showForm && user?.isAdmin && (
//         <SupplyForm
//           supply={editing}
//           onClose={() => setShowForm(false)}
//           onSave={() => {
//             dispatch(fetchSupplies());
//             setShowForm(false);
//           }}
//         />
//       )}
//     </div>
//   );
// };

// export default SupplyManagement;
import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  fetchSupplies,
  deleteSupply,
  changeSupplyQuantity
} from '../features/supplies/suppliesSlice';
import SupplyForm from './SupplyForm';
import './SupplyManagement.css';

const CATEGORY_STYLES = {
  FOOD: 'bg-food',
  CLOTHES: 'bg-clothes',
  SHELTER: 'bg-shelter'
};

const SupplyManagement = () => {
  const dispatch = useDispatch();
  const supplies = useSelector(state => state.supplies.items);
  const { user } = useSelector(state => state.auth);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchSupplies());
  }, [dispatch]);

  const handleAdd = () => {
    if (!user?.isAdmin) return alert('Only admins can add supplies.');
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = s => {
    if (!user?.isAdmin) return alert('Only admins can edit.');
    setEditing(s);
    setShowForm(true);
  };

  const handleDelete = id => {
    if (!user?.isAdmin) return alert('Only admins can delete.');
    if (window.confirm('Delete this supply?')) dispatch(deleteSupply(id));
  };

  const handleQuantity = (id, action) => {
    if (!user?.isAdmin) return alert('Only admins can modify quantity.');
    const amt = parseInt(prompt('Enter amount'), 10);
    if (amt > 0) dispatch(changeSupplyQuantity({ id, action, amount: amt }));
  };

  return (
    <div className="supply-management">
      {user?.isAdmin && (
        <button className="add-btn" onClick={handleAdd}>
          Add New Supply
        </button>
      )}

      {['FOOD','CLOTHES','SHELTER'].map(cat => (
        <section key={cat} className="category-section">
          <h3 className="category-title">{cat}</h3>
          <div className="supply-list">
            {supplies.filter(s => s.category===cat).map(s => (
              <div key={s._id} className={`supply-card ${CATEGORY_STYLES[cat]}`}>
                <div className="supply-header">
                  <h4 className="supply-name">{s.name}</h4>
                  {s.quantity < s.threshold && <span className="low-badge">Low</span>}
                </div>
                <div className="supply-metrics">
                  <p><strong>Qty:</strong> {s.quantity}</p>
                  <p><strong>Loc:</strong> {s.location}</p>
                </div>

                {user?.isAdmin && (
                  <div className="supply-actions">
                    <button className="edit-btn" onClick={()=>handleEdit(s)}>Edit</button>
                    <button className="delete-btn" onClick={()=>handleDelete(s._id)}>Delete</button>
                    <button className="qty-btn" onClick={()=>handleQuantity(s._id,'increase')}>＋</button>
                    <button className="qty-btn" onClick={()=>handleQuantity(s._id,'decrease')}>－</button>
                  </div>
                )}
              </div>
            ))}
            {supplies.filter(s=>s.category===cat).length===0 && (
              <div className="no-supplies">No {cat.toLowerCase()} supplies</div>
            )}
          </div>
        </section>
      ))}

      {showForm && user?.isAdmin && (
        <SupplyForm
          supply={editing}
          onClose={()=>setShowForm(false)}
          onSave={()=>{dispatch(fetchSupplies());setShowForm(false);}}
        />
      )}
    </div>
  );
};

export default SupplyManagement;
