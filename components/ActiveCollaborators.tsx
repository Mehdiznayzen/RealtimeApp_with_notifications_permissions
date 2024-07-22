import { useOthers } from "@liveblocks/react/suspense"
import Image from "next/image"

const ActiveCollaborators = () => {
    const others = useOthers()

    const collaborators = others.map((other) => other.info)
    return (
        <ul className="collaborators-list">
            {
                collaborators.map((collaborator) => {
                    const { avatar, color, email, id, name } = collaborator
                    return (
                        <li 
                            className="" 
                            key={id}
                        >
                            <Image 
                                src={avatar}
                                alt={name}
                                width={100}
                                height={100}
                                className="inline-block size-8 rounded-full ring-2 ring-dark-100"
                                style={{
                                    border : `2px solid ${color}`
                                }}
                            />
                        </li>
                    )
                })
            }
        </ul>
    )
}

export default ActiveCollaborators