const DICE_LIBRARY = {
    tri: {
        id: 'tri',        
        name: '三之骰子',
        faces: [1, 2, 3, 4, 5, 6],
        probabilities: { 3: 0.33 },
        description: '有极大概率会投出3'
    },

    demon: {
        id: 'demon',
        name: '恶魔骰子',
        faces: [1, 2, 3, 4, 5, 6],
        probabilities: { 1: 0.33, 6: 0.33 },
        description: '有极大概率会投出1或6',
    }
};