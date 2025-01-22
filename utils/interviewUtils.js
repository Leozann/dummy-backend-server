const moveUserToRejectedBoard = (userId) => {
    let foundUser = null;

    // Iterate over sections to find the user
    Object.keys(sections).forEach(sectionName => {
        const section = sections[sectionName];
        const candidateIndex = section.candidate.findIndex(user => user.userId === userId);

        if (candidateIndex !== -1) {
            // Remove the user from their current section
            foundUser = section.candidate.splice(candidateIndex, 1)[0];
            section.totalCandidate -= 1;
        }
    });

    if (!foundUser) {
        throw new Error('User not found');
    }

    // Add the user to the "rejected" section
    const rejectedSection = sections['rejected'];
    rejectedSection.candidate.push(foundUser);
    rejectedSection.totalCandidate += 1;

    return foundUser;
};

export { moveUserToRejectedBoard };