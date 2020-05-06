export default class RaidService {
     async fetchAll() {
        return await fetch('raids');
    }
     async fetchRecord(raidId: number) {
        return await fetch('raids/${raidId}');
    }
}