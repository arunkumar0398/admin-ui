import { EditFilled, DeleteFilled, SaveFilled } from "@ant-design/icons";

export const MemberRow = ({ member, isSelected, isEditing, onCheckboxChange, onEditClick, onDeleteClick, onEditInputChange, editedMember, onSaveClick }) => (
    <tr className={isSelected ? "each-row checked-active" : "each-row"}>
        <td><input type="checkbox" checked={isSelected} onChange={() => onCheckboxChange(member.id)} /></td>
        <td>{isEditing ? <input type="text" value={editedMember.name || member.name} onChange={(event) => onEditInputChange(event, 'name')} /> : member.name}</td>
        <td>{isEditing ? <input type="text" value={editedMember.email || member.email} onChange={(event) => onEditInputChange(event, 'email')} /> : member.email}</td>
        <td>{isEditing ? <input type="text" value={editedMember.role || member.role} onChange={(event) => onEditInputChange(event, 'role')} /> : member.role}</td>
        <td>
            {isEditing ? 
                <SaveFilled className="save-icon" onClick={onSaveClick} /> :
                <EditFilled className="edit-icon" onClick={() => onEditClick(member.id)} />
            }
            <DeleteFilled className="delete-icon" onClick={() => onDeleteClick(member.id)} />
        </td>
    </tr>
);