import React, { Component } from "react";
import { membersList } from "../action/members";
import { CaretLeftOutlined, CaretRightOutlined, EditFilled, DeleteFilled, SaveFilled, BackwardOutlined, ForwardOutlined } from "@ant-design/icons";

class AdminUI extends Component {
    constructor() {
        super();
        this.state = {
            members: [],
            currentPage: 1,
            totalPages: 0,
            editingMemberId: null,
            searchTerm: "",
            searchResults: [],
            selectedMembers: new Set(),
            isSelectAllChecked: false,
            isEditIconClicked: false,
            editedMember: {} // Track edited member
        };
    }

    componentDidMount = async () => {
        try {
            const resultOfMembers = await membersList();
            const totalPages = Math.ceil(resultOfMembers.length / 10);
            this.setState({ members: resultOfMembers, totalPages });
        } catch (error) {
            console.error("Error fetching members:", error);
        }
    };

    handleEditClick = (memberId) => {
        this.setState({ editingMemberId: memberId, isEditIconClicked: true });
    };

    handleDeleteClick = (memberId) => {
        this.setState(prevState => ({
            members: prevState.members.filter(member => member.id !== memberId),
            selectedMembers: (() => {
                const updatedSelectedMembers = new Set(prevState.selectedMembers);
                updatedSelectedMembers.delete(memberId);
                return updatedSelectedMembers;
            })()
        }));
    };

    handleSearchChange = (event) => {
        const searchTerm = event.target.value;
        this.setState({ searchTerm }, () => {
            this.searchMembers();
        });
    };

    searchMembers = () => {
        const { members, searchTerm } = this.state;
        const filteredMembers = members.filter(member =>
            member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const totalPages = Math.ceil(filteredMembers.length / 10);
        this.setState({ searchResults: filteredMembers, totalPages, currentPage: 1 });
    };

    handleCheckboxChange = (memberId) => {
        const { selectedMembers, members } = this.state;
        if (selectedMembers.has(memberId)) {
            selectedMembers.delete(memberId);
        } else {
            selectedMembers.add(memberId);
        }
        this.setState({ selectedMembers });
    };

    handleSelectAllChange = () => {
        const { isSelectAllChecked, members, currentPage } = this.state;
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const currentMembers = members.slice(startIndex, endIndex);
        const selectedMembers = new Set();

        if (!isSelectAllChecked) {
            currentMembers.forEach(member => selectedMembers.add(member.id));
        }

        this.setState({
            isSelectAllChecked: !isSelectAllChecked,
            selectedMembers
        });
    };

    handleFirstPageClick = () => {
        this.setState({
            currentPage: 1
        });
    };
    
    handleLastPageClick = () => {
        const { totalPages } = this.state;
        this.setState({
            currentPage: totalPages
        });
    };

    handleDeleteSelected = () => {
        const { selectedMembers, members } = this.state;
        const updatedMembers = members.filter(member => !selectedMembers.has(member.id));
        const totalPages = Math.ceil(updatedMembers.length / 10);
        this.setState({ members: updatedMembers, totalPages, selectedMembers: new Set(), isSelectAllChecked: false});
        
    };

    handleSaveClick = () => {
        const { editedMember, members,editingMemberId } = this.state;        
        const editedMemberIndex = members.findIndex(member => member.id === editingMemberId);

        const updatedMembers = [...members];
        updatedMembers[editedMemberIndex] = { ...updatedMembers[editedMemberIndex], ...editedMember };
        
        this.setState({ members: updatedMembers, editingMemberId: null, isEditIconClicked: false, editedMember: {} });
    };

    handleEditInputChange = (event, field) => {
        const { editedMember } = this.state;
        const value = event.target.value;
        this.setState({
            editedMember: {
                ...editedMember,
                [field]: value
            }
        });
    };

    render() {
        const { members, currentPage, totalPages, editingMemberId, searchTerm, searchResults, selectedMembers, isSelectAllChecked, isEditIconClicked, editedMember } = this.state;
        const startIndex = (currentPage - 1) * 10;
        const endIndex = startIndex + 10;
        const currentMembers = searchTerm ? searchResults.slice(startIndex, endIndex) : members.slice(startIndex, endIndex);

        // Generate page numbers
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return (
            <div className="admin-ui-list">
                <div className="search-input">
                    <input type="text" placeholder="Search by name, email or role" onChange={this.handleSearchChange} />
                </div>
                <div className="table-members">
                    <table>
                        <thead>
                            <tr>
                                <th>
                                    <input type="checkbox" checked={isSelectAllChecked} onChange={this.handleSelectAllChange} />
                                </th>
                                <th>Name</th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentMembers.map((member, index) => (
                                <tr key={member.id} 
                                    className={selectedMembers.has(member.id) ? "each-row checked-active" : "each-row"}
                                >
                                    <td><input type="checkbox" checked={selectedMembers.has(member.id)} onChange={() => this.handleCheckboxChange(member.id)} /></td>
                                    <td>{editingMemberId === member.id ? <input type="text" value={editedMember.name || member.name} onChange={(event) => this.handleEditInputChange(event, 'name')} /> : member.name}</td>
                                    <td>{editingMemberId === member.id ? <input type="text" value={editedMember.email || member.email} onChange={(event) => this.handleEditInputChange(event, 'email')} /> : member.email}</td>
                                    <td>{editingMemberId === member.id ? <input type="text" value={editedMember.role || member.role} onChange={(event) => this.handleEditInputChange(event, 'role')} /> : member.role}</td>
                                    <td>
                                        {isEditIconClicked && editingMemberId === member.id ? 
                                            <SaveFilled 
                                                className="save-icon" 
                                                onClick={this.handleSaveClick} 
                                            /> :
                                            <EditFilled
                                                className="edit-icon"
                                                onClick={() =>  {
                                                    this.handleEditClick(member.id); 
                                                }}
                                            />
                                        }
                                        <DeleteFilled
                                            className="delete-icon"
                                            onClick={() => this.handleDeleteClick(member.id)}
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                    {/* Pagination controls */}                    
                    <div className="pagination-bar"> 
                        <div className="delete-section">
                            <button className="select-deleted" onClick={this.handleDeleteSelected}>
                                Delete Selected
                            </button>
                        </div> 

                        <BackwardOutlined
                            className={ currentPage === 1 ? "first-page-button" : "first-page-button active"}
                            disabled={ currentPage === 1 }
                            onClick={ this.handleFirstPageClick }
                        />
                        <CaretLeftOutlined 
                            className={currentPage===1 ? `previous-btn` : `previous-btn active`}
                            disabled={currentPage === 1}
                            onClick={() =>
                                this.setState({
                                    currentPage: currentPage - 1
                                })
                            }
                        />
                        {pageNumbers.map((pageNumber) => (
                            <button 
                                key={pageNumber}
                                onClick={() =>
                                    this.setState({
                                        currentPage: pageNumber
                                    })
                                }
                                className={pageNumber === currentPage ? "active page-button" : "page-button"}
                            >
                                {pageNumber}
                            </button>
                        ))}
                        <CaretRightOutlined
                            className={currentPage === totalPages ? `next-btn` : `next-btn active`}
                            disabled={currentPage === totalPages}
                            onClick={() =>
                                this.setState({
                                    currentPage: currentPage + 1
                                })
                            }
                        />
                        <ForwardOutlined
                            className={ currentPage === totalPages ? "last-page-button" : "last-page-button active" }
                            disabled={currentPage === totalPages}
                            onClick={this.handleLastPageClick}
                        />
                    </div>
            </div>
        );
    }
}

export default AdminUI;