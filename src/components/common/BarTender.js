import React, { useState, useEffect } from 'react';
import AlertNotification from '../specific/AlertNotification';

const BarTender = ({
    syncStatus,
    error,
    barList,
    filteredBars,
    bartenderFormData,
    searchQuery,
    filterTables,
    handleBarTenderInputChange,
    handleAssociateBar,
    setSearchQuery,
    setFilterTables,
    notification,
}) => {
    const [showMessage, setShowMessage] = useState(false);

    useEffect(() => {
        if (['success', 'error', 'warning'].includes(notification?.type)) {
            setShowMessage(true);
        } else {
            setShowMessage(false);
        }
    }, [notification]);

    return (
        <div>
            <h3 className="text-center">Sélectionnez le Bar que vous souhaitez gérer</h3>
             
            {/* Sync status and errors */}
            {syncStatus === 'loading' && (
                <div className="alert alert-info text-center" role="alert">
                    Syncing data with Firestore...
                </div>
            )}
            {syncStatus === 'error' && (
                <div className="alert alert-danger text-center" role="alert">
                    Error syncing data: {error}
                </div>
            )}
            
            {syncStatus === 'success' && barList.length > 0 ? (
                <>
                    <form onSubmit={handleAssociateBar}>
                        {showMessage && (<AlertNotification type={notification.type} messages={notification.messages} />)}
                        
                        <div className="row g-3 align-items-end">
                            <div className="col-md-5">
                                <label htmlFor="ownerPhone" className="form-label">Téléphone du propriétaire du Bar</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="ownerPhone"
                                    name="ownerPhone"
                                    value={bartenderFormData.ownerPhone}
                                    onChange={(e) => handleBarTenderInputChange(e, 'bartender')}
                                    placeholder="Entrer le téléphone du propriétaire"
                                    required
                                />
                            </div>

                            <div className="col-md-5">
                                <label htmlFor="ownerPassword" className="form-label">Mot de passe du propriétaire du Bar</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="ownerPassword"
                                    name="ownerPassword"
                                    value={bartenderFormData.ownerPassword}
                                    onChange={(e) => handleBarTenderInputChange(e, 'bartender')}
                                    placeholder="Entrer le mot de passe"
                                    required
                                />
                            </div>

                            <div className="col-md-2 text-center">
                                <button type="submit" className="btn btn-primary w-100 big-middle">Associez le Bar</button>
                            </div>
                        </div>
                    </form>

                    {/* Search and filter functionality */}
                    <div className="mt-4 mb-4">
                        <div className="input-group">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Rechercher par nom ou emplacement"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <select
                                className="form-select"
                                value={filterTables}
                                onChange={(e) => setFilterTables(e.target.value)}
                            >
                                <option value="">Filtrer par nombre de tables</option>
                                <option value="1-5">1-5 Tables</option>
                                <option value="6-10">6-10 Tables</option>
                                <option value="11+">11+ Tables</option>
                            </select>
                        </div>
                    </div>

                    {/* Bar data table */}
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Nom du Bar</th>
                                    <th>Emplacement</th>
                                    <th>Nombre de Tables</th>
                                    <th>Sélectionner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBars.map((bar) => (
                                    <tr key={bar.id}>
                                        <td>{bar.name}</td>
                                        <td>{bar.location}</td>
                                        <td>{bar.numberOfTables}</td>
                                        <td>
                                            <input
                                                type="radio"
                                                name="selectedBar"
                                                value={bar.id}
                                                onChange={(e) =>
                                                    handleBarTenderInputChange(e, 'bartender', {
                                                        id: bar.id,
                                                        uid: bar.uid,
                                                        name: bar.name,
                                                        location: bar.location,
                                                        numberOfTables: bar.numberOfTables,
                                                        ownerUid: bar.ownerUid,
                                                    })
                                                }
                                                required
                                            />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : (
                syncStatus === 'success' && barList.length === 0 && (
                    <div className="alert alert-warning text-center" role="alert">
                        Pas de bars disponibles à associer pour le moment.
                    </div>
                )
            )}
        </div>
    );
};

export default BarTender;
