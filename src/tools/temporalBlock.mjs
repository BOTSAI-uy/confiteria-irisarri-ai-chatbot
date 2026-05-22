const hourMs = 60 * 60 * 1000 // una hora por defecto

export class TemporalBlock {
  static blockedContacts = new Map()

  static addContact(userIdKey, time = hourMs) {
    this.blockedContacts.set(userIdKey, time)
  }

  static removeContact(userIdKey) {
    this.blockedContacts.delete(userIdKey)
  }

  static isContactBlocked(userIdKey) {
    const contact = this.blockedContacts.get(userIdKey)
    if (!contact) {
      return false
    }
    const time = contact.time
    const now = Date.now()
    if (now - time > contact.timeToBlock) {
      this.removeContact(userIdKey)
      return false
    }
    return true
  }
}
