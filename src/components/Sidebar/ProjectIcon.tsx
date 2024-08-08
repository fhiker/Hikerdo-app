
interface Props {
    iconColor: string,
    size: number
}

const ProjectIcon = ({ iconColor, size }: Props) => {
    return (
        <div aria-label='project' style={{ backgroundColor: iconColor }} className={`rounded-md w-${size} h-${size}`} />
    )
}

export default ProjectIcon