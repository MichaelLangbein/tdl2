# Email

- **User-Agent**: Outlook, Thunderbird, Hotmail, ...
- **MTA**: Message transfer agent
  - A router for email. Email travels through the internet via a series of MTAs.
  - `michael@gmail.com` <-- `gmail` is an MTA's name
- **SMTP**: Simple mail transfer protocol
  - The protocol MTAs use to communicate.
    - Not encrypted per default
- **POP3 and IMAP**:
  - 'last mile' protocol for communication between user-agent and MTA.
  - POP3: only downloads inbox, no syncing of folders, no copies kept on server after download.
  - IMAP: compares all folders, folders synced to agent, mail kept on server.
    - not encrypted by default

Email comes from a time before security and is not encrypted by default.

# Calendars
 - **DAV**: (HTTP/CalDAV) Protocol. Read-write.
 - **ICAL**: xml file containing all calendar events. Read-only.