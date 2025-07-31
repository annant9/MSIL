export interface Prediction {
    'prediction': string,
    'features': string,
    'explanation': string
}

export interface Summary {
    'model_output': Prediction,
    'dealer_remarks': string
}