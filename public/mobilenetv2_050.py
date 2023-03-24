def compute_batch(photos_batch, transform, model):
    from PIL import Image
    import torch
    # Load all the photos from the files
    photos = [Image.open(photo_file).convert('RGB') for photo_file in photos_batch]
 
    # Preprocess all photos
    photos_preprocessed = torch.stack([transform(photo) for photo in photos]).cuda()
 
    with torch.no_grad():
        # Encode the photos batch to compute the feature vectors and normalize them
        output = model(photos_preprocessed)
        top1_probabilities, top1_class_indices = torch.topk(output.softmax(dim=1) * 100, k=1)
 
    # Transfer the feature vectors back to the CPU and convert to numpy
    return top1_class_indices
 
def check_soluiton(input_df_name):
    import pandas as pd
    df = pd.read_csv(input_df_name)
    import timm 
    import torch
    import math
    import numpy as np
    from timm.data.transforms_factory import create_transform
    from timm.data import resolve_data_config
 
    model = timm.create_model('mobilenetv2_050', pretrained = True).cuda()
    model.eval()
    transform = create_transform(**resolve_data_config(model.pretrained_cfg, model=model))
    l_data = df.imgs_path
    batch_size = 32
    # Compute how many batches are needed
    batches = math.ceil(len(l_data) / batch_size)
    pred_l = []
 
    for i in range(batches):
        batch_files = l_data[i*batch_size : (i+1)*batch_size]
        batch_probas = compute_batch(batch_files, transform, model)
        pred_l.append(batch_probas.cpu())
    df['predictions'] = np.vstack(pred_l)
    del model
    df.to_csv('predict_submission.csv')