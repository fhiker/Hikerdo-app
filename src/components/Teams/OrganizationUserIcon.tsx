
const OrganizationUserIcon = ({ initials }: { initials: string }) => {
    return (
        <figure>
            <div className="avatar placeholder">
                <div className="bg-black text-white rounded-full w-24">
                    <span className="text-3xl">{initials}</span>
                </div>
            </div>
        </figure>
    )
}

export default OrganizationUserIcon