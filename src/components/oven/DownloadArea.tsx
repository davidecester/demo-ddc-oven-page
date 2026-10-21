import type { DownloadFileIcon, DownloadGroup } from '../../types/oven'
import { IconButton } from '../ui/Button'
import { Icon } from '../ui/Icon'

interface DownloadAreaProps {
  groups: DownloadGroup[]
  className?: string
}

const FILE_ICON: Record<DownloadFileIcon, string> = {
  pdf: 'pdf',
  folder: 'folder',
}

/** "Area download": documents grouped by type. Sits on the page background, not in a card. */
export function DownloadArea({ groups, className }: DownloadAreaProps) {
  return (
    <section
      aria-labelledby="downloads-title"
      className={`flex flex-col gap-9 border-t border-white px-1 pt-[15px] pb-4 md:pt-[23px] md:pb-6 ${className ?? ''}`}
    >
      <h2 id="downloads-title" className="type-heading-xs text-content-primary">
        Downloads
      </h2>
      <div className="flex flex-col gap-6 md:grid md:grid-cols-2 md:gap-4 lg:flex lg:flex-row">
        {groups.map((group) => (
          <section key={group.title} aria-label={group.title} className="flex min-w-0 flex-1 flex-col gap-4">
            <h3 className="type-label-sm text-content-quaternary uppercase">{group.title}</h3>
            <ul className="flex flex-col gap-2">
              {group.files.map((file) => (
                <li key={file.name} className="flex items-center justify-between gap-2">
                  <span className="flex min-w-0 items-center gap-2">
                    <Icon name={FILE_ICON[file.icon]} size={20} />
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="type-label-md text-content-primary">{file.name}</span>
                      <span className="type-paragraph-xs text-content-quaternary">{file.details}</span>
                    </span>
                  </span>
                  <IconButton icon="download" iconSize={16} boxSize={32} label={`Download ${file.name}`} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </section>
  )
}
