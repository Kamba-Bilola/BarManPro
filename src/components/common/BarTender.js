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
            <h4 className='pb-3'>Sélectionnez le Bar que vous souhaitez gérer</h4>
             
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
                        <p className='form-label style={{ textAlign: "justify" }}'>Selectionnez un bar avant la validation du téléphone et du mot de passe du propriètaire</p>
                        <div className="row g-3 d-flex text-start">
                            <div className="col-md-6 flex-fill w-50">
                                <label htmlFor="ownerPhone" className="form-label">Téléphone</label>
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

                            <div className="col-md-6 flex-fill w-50">
                                <label htmlFor="ownerPassword" className="form-label">Mot de passe</label>
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
                            </div></div>
                            <div className="row g-3 align-items-end">
                            <div className="col-md-12 text-center w-100 pt-2">
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
                           
                        </div>
                    </div>

                    {/* Bar data table */}
                    <div className="table-responsive">
                        <table className="table table-striped table-bordered">
                            <thead>
                                <tr>
                                    <th>Informations du BAR</th>
                                    <th>Sélectionner</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredBars.map((bar) => (
                                    <tr key={bar.id}>
                                        <td><span>{bar.name} </span>
                                        <span>{bar.location} </span></td>
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
